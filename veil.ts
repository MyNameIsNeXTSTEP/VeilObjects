/**
 * Wraps a target object with provided presets object
 * and when trying to access the provided presets methods on the veil object
 * it passes them throuhg, until the veil object is pierced, meaning the use methods
 * not listed in the provided preset object
 */
class Veil<T = any> {
  private pierced: boolean;

  constructor(
    private readonly target: T,
    private readonly presets: Map<keyof T, any>
  ) {
    this.target = target;
    this.presets = new Map(Object.entries(presets) as [keyof T, any][]);
    this.pierced = false;

    Object.getOwnPropertyNames(
      Object.getPrototypeOf(this.target)
    )
      .slice(1)
      .forEach(
        methodName => {
          if (typeof (this.target as any)[methodName] === 'function') {
            (this as any)[methodName] = this.wrapMethod(methodName as keyof T);
          }
        }
      );
  };

  wrapMethod(methodName: keyof T) {
    return (...args: any[]) => {
      if (!this.pierced && this.presets.has(methodName)) {
        return this.presets.get(methodName);
      }
      if (!this.pierced) {
        this.pierce();
      }
      const targetMethod = (this.target as any)[methodName];
      if (typeof targetMethod === 'function') {
        return targetMethod.apply(this.target, args);
      }
      throw new Error(`Method "${String(methodName)}" does not exist on the target object.`);
    };
  }

  pierce(): void {
    this.pierced = true;
  }
};

export default Veil;
