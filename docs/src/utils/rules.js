import { validateSuccess, validateError, validateWarn } from '@/utils/validate';

export default {
  error(val) {
    if (!val) {
      return validateError('必填字段测试文本')
    } else {
      return validateSuccess()
    }
  },
  warn(val) {
    if (!val) {
      return validateWarn('警告字段测试文本')
    } else {
      return validateSuccess()
    }
  }
}
