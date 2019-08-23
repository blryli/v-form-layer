import { validateSuccess, validateError, validateWarn } from '@/utils/validate';

export default {
  name(val) {
    if (!val) {
      return validateError('名字不能为空！')
    } else {
      return validateSuccess()
    }
  },
  age(val) {
    if (!val) {
      return validateWarn('年龄不能为空！')
    } else {
      return validateSuccess()
    }
  }
}
