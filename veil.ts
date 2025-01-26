/**
 * Wraps a target object with provided presets object
 * and when trying to access the provided presets methods on the veil object
 * it passes them throuhg, until the veil object is pierced, meaning the use methods
 * not listed in the provided preset object
 */
class Veil<T,> {
  private pierced: boolean;
  private targetProto: any;
  private readonly target: T;
  private readonly presets: Map<keyof T, [keyof T, any]>;

  constructor(
    target: T,
    presets: Record<string, string | number | object >,
  ) {
    this.target = target;
    this.presets = new Map(Object.entries(presets) as [keyof T, any][]);
    this.pierced = false;
    /**
     * Use target object methods as native.
     */
    this.targetProto = Object.getPrototypeOf(this.target);
    Object.getOwnPropertyNames(this.targetProto).forEach(
      methodName => {
        if (typeof this.target[methodName] === 'function' && methodName !== 'constructor') {
          this.useTargetMethod(methodName);
        }
      }
    );
  };
  
  /**
   * If a target method satisfies - use it as a native Veil object method (caching).
   */
  private useTargetMethod(methodName: string) {
    this[methodName] = (...args) => {
      return this.acceptPresetMethodOrPierce(methodName, args);
    };
  };
  
  /**
   * Depending on a #pierced flag:
   * Either use the target presets data (not pierced) or invoke a target method (pierced).
   */
  private acceptPresetMethodOrPierce(methodName, ...args) {
    if (!this.pierced && this.presets.has(methodName)) {
      return this.presets.get(methodName);
    }
    if (!this.pierced) {
      this.pierce();
    }
    return this.applyTargetMethod(methodName, args)
  };
  
  /**
   * Apply target method if the veil is pierced. 
   */
  private applyTargetMethod(methodName, ...args) {
    var targetMethod = this.target[methodName];
    return targetMethod.apply(this.target, args);
  };

  /**
   * Pierce the veil (drop a cache) to use a target method.
   */
  private pierce() {
    this.pierced = true;
  };
};

export default Veil;
