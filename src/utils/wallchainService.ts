import { RouterTypes } from 'config/constants'
import { WALLCHAIN_PARAMS } from 'config/constants/chains'
import { BigNumberish, BytesLike, Contract } from 'ethers'
import { SwapDelay, RouterTypeParams, DataResponse } from 'state/swap/actions'
import { ApeRouterManager } from '../config/abi/types/ApeRouterManager'
import ApeRouterManagerABI from '../config/abi/apeRouterManager.json'

/**
 * Configure whitelisted bonus router functions.
 *
 * The data that is brought back from the API will attempt to be decoded by these functions.
 * If the data cannot be decoded from the allowed functions then the validation SHOULD fail.
 *
 * This is important to protect against a compromised API
 */
export const ALLOWED_BONUS_ROUTER_FUNCTIONS = <const>[
  'swapExactTokensForTokens',
  'swapTokensForExactTokens',
  'swapExactETHForTokens',
  'swapTokensForExactETH',
  'swapExactTokensForETH',
  'swapETHForExactTokens',
]
export type BONUS_ROUTER_FUNCTION_TYPE = typeof ALLOWED_BONUS_ROUTER_FUNCTIONS[number]

interface RouterFunctionParams {
  amountInMax?: BigNumberish
  amountIn?: BigNumberish
  amountOut?: BigNumberish
  amountOutMin?: BigNumberish
  path: string[]
  to: string
  deadline: BigNumberish
  router: string
  masterInput: BytesLike
}

export function decodeWallchainFunctionData(data: string): {
  functionName: BONUS_ROUTER_FUNCTION_TYPE | undefined
  functionParams: RouterFunctionParams | undefined
} {
  const apeRouterManager = new Contract(
    '0x0000000000000000000000000000000000000000',
    ApeRouterManagerABI,
  ) as ApeRouterManager

  let functionName
  let functionParams
  // eslint-disable-next-line no-restricted-syntax
  for (const allowedFunctionName of ALLOWED_BONUS_ROUTER_FUNCTIONS) {
    try {
      functionParams = apeRouterManager.interface.decodeFunctionData(allowedFunctionName, data)
      functionName = allowedFunctionName
      break
    } catch (e) {
      //
    }
  }
  return { functionName, functionParams }
}

/**
 *
 * @param dataResponse
 * @param value
 * @param account
 * @param contractAddress
 * @returns
 */
const wallchainResponseIsValid = (
  dataResponse: DataResponse,
  methodName: BONUS_ROUTER_FUNCTION_TYPE,
  args: (string | string[])[],
  value: string,
  account: string,
  contractAddress: string,
) => {
  if (!dataResponse.pathFound) {
    // Opportunity was not found -> response should be ignored -> valid.
    return false
  }

  const { functionName, functionParams } = decodeWallchainFunctionData(dataResponse.transactionArgs.data)

  // TODO: Can validate additional params based on args passed
  // if (!functionParams) {
  //   // Function did not decode based on method name passed.
  //   return false
  // }

  // TODO: This is where we can send an alert that the arbitrage is not working
  const isValid =
    // functionParams?.to.toLowerCase() === account.toLowerCase() &&
    // functionName === methodName &&
    dataResponse.transactionArgs.destination.toLowerCase() === contractAddress.toLowerCase() &&
    dataResponse.transactionArgs.value.toLowerCase() === value.toLowerCase() &&
    dataResponse.transactionArgs.sender.toLowerCase() === account.toLowerCase()

  return isValid
}

/**
 * Call Wallchain API to analyze the expected opportunity.
 * @param methodName function to execute in transaction
 * @param args arguments for the function
 * @param value value parameter for the transaction
 * @param chainId chainId of the blockchain
 * @param account account address from sender
 * @param contract ApeSwap Router contract
 * @param onBestRoute Callback function to set the best route
 * @param onSetSwapDelay Callback function to set the swap delay state
 */
export default function callWallchainAPI(
  methodName: BONUS_ROUTER_FUNCTION_TYPE,
  args: (string | string[])[],
  value: string,
  chainId: number,
  account: string,
  contract: Contract,
  onBestRoute: (bestRoute: RouterTypeParams) => void,
  onSetSwapDelay: (swapDelay: SwapDelay) => void,
): Promise<any> {
  onSetSwapDelay(SwapDelay.LOADING_ROUTE)
  const encodedData = contract.interface.encodeFunctionData(methodName, args)
  // Allowing transactions to be checked even if no user is connected
  const activeAccount = account || '0x0000000000000000000000000000000000000000'

  // If the intiial call fails APE router will be the default router
  return fetch(`${WALLCHAIN_PARAMS[chainId].apiUrl}?key=${WALLCHAIN_PARAMS[chainId].apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      value,
      sender: activeAccount,
      data: encodedData,
      destination: contract.address,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      console.error('Wallchain Error', response.status, response.statusText)
      onBestRoute({ routerType: RouterTypes.APE })
      onSetSwapDelay(SwapDelay.VALID)
      return null
    })
    .then((responseJson) => {
      if (responseJson) {
        const dataResponse: DataResponse = responseJson
        if (wallchainResponseIsValid(dataResponse, methodName, args, value, activeAccount, contract.address)) {
          onBestRoute({ routerType: RouterTypes.BONUS, bonusRouter: dataResponse })
          onSetSwapDelay(SwapDelay.VALID)
        } else {
          onBestRoute({ routerType: RouterTypes.APE })
          onSetSwapDelay(SwapDelay.VALID)
        }
      }
      onSetSwapDelay(SwapDelay.VALID)
      return null
    })
    .catch((error) => {
      onBestRoute({ routerType: RouterTypes.APE })
      onSetSwapDelay(SwapDelay.VALID)
      console.error('Wallchain Error', error)
    })
}
