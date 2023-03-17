
export interface PageSpring<Type> {
  content: Array<Type>,
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

export interface PageSpringAttr{
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

export function PageAttrObj(data: PageSpring<any>): PageSpringAttr{
  return {
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    numberOfElements: data.numberOfElements
  }
}

export function EmptyPageAttrObj(): PageSpringAttr{
  const emptyPageSpring: PageSpring<any> = {
    numberOfElements: 0,
    totalPages: 0,
    totalElements: 0,
    content: []
  };
  return PageAttrObj(emptyPageSpring);
}
