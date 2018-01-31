import _home from './home'
import _storeAuthKey from './storeAuthKey'

export default function (options) {
  return {
    home: _home(options),
    storeAuthKey: _storeAuthKey(options)
  }
}
