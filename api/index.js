function requireContextApi(context) {
  return context.keys().reduce((sofar, fileName) => ({
    ...sofar,
    [fileName.match(/[^/]+(?=\.js$)/)[0]]: context(fileName)
  }), {})
}

const api = requireContextApi(require.context('./modules/', true, /\.js$/))

export default api
