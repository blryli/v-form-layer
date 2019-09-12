export const validateSuccess = (message) => {
  return {
    message,
    effect: '#67c23a',
    disabled: true,
    referenceBorderColor: "#67c23a",
    referenceBgColor: "#e1f3d8",
    layerClass: 'success'
  }
}


export const validateError = (message) => {
  return {
    message, 
    effect: "#F56C6C",
    referenceBorderColor: "#F56C6C",
    referenceBgColor: "#fde2e2",
    stop: true,
    layerClass: 'error'
  }
}
export const validateWarn = (message) => {
  return {
    message,
    effect: "#E6A23C",
    referenceBorderColor: "#E6A23C",
    referenceBgColor: "#faecd8",
    layerClass: 'warn'
  }
}
