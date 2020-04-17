export const filterUnique = (data: any[]) =>
  data.filter((item, index) => data.indexOf(item) === index)

export const filterUniqueByKey = (data: any[], key: string) =>
  data.filter(
    (item, index) =>
      data.findIndex(searchItem => searchItem[key] === item[key]) === index,
  )

export const filterEmpty = (data: any[]) => data.filter(Boolean)
