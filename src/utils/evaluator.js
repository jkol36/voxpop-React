export const evaluate = map => {
  let results = []
  if (map.length > 0) {
    if (!!map[0].fieldName) results = {}

    for (let i = 0; i < map.length; i++) {
      const { payload, expr, fieldName } = map[i]

      if (!expr) {
        if (!fieldName) results.push(payload)
        else results[fieldName] = payload
      }
    }
  }

  return results
}
