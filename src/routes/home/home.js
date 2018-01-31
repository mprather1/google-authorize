export default function (options) {
  return function (req, res) {
    res.status(200)
    .json({
      body: 'success'
    })
  }
}
