export const validateSuccess = (message) => {
  return {
    message,
    effect: '#67c23a',
    disabled: true,
    referenceBorderColor: "#67c23a",
    referenceBgColor: "#e1f3d8"
  }
}


export const validateError = (message) => {
  return {
    message, 
    effect: "#F56C6C",
    referenceBorderColor: "#F56C6C",
    referenceBgColor: "#fde2e2",
    stop: true
  }
}
export const validateWarn = (message) => {
  return {
    message,
    effect: "#E6A23C",
    referenceBorderColor: "#E6A23C",
    referenceBgColor: "#faecd8"
  }
}
