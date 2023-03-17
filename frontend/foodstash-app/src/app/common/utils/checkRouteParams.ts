
export function verifyRouteParam(param: string){
  const p = Number(param);
  return !isNaN(+p);
}

export function verifyActivationRouteParam(param: string){
  const regExp = /^[A-Za-z0-9]*$/g;
  return regExp.test(param);
}
