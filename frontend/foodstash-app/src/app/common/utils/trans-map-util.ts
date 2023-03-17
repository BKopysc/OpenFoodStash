
export class TransMapUtil{

  private usedTransMap: Map<any, any>

  public constructor(transMap: Map<any,any>) {
    this.usedTransMap = transMap;
  }

  getTranslated(rawString: string): string {
    const res = this.usedTransMap.get(rawString);
    if(!res) {
      return '';
    } else {
      return res;
    }
  }

}
