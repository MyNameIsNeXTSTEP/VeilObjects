class Project {
  constructor(
    private readonly offerId: number
  ) {
    this.offerId = offerId;
  };

  name(): string {
    return 'name';
  }

  author(): string {
    return 'author';
  }

  description(): string {
    return 'desc';
  }
};

class Veil<T extends object> {
  private pierced: boolean;
  private readonly _presets: Map<keyof T, any>;

  constructor(
    private readonly target: T,
    private readonly presets: Partial<T>
  ) {
    this.target = target;
    this._presets = new Map(Object.entries(presets) as [keyof T, any][]);
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

  private wrapMethod(methodName: keyof T) {
    return (...args: any[]) => {
      if (!this.pierced && this._presets.has(methodName)) {
        return this._presets.get(methodName);
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

  private pierce(): void {
    this.pierced = true;
  }
};


function fetchData(field: string, id: number): string {
  const database = {
    1: { name: 'foo', author: 'yegor256', description: 'A sample project' },
    2: { name: 'bar', author: 'john_doe', description: 'Another project' },
  };
  // @ts-ignore
  return database[id][field];
};

type TVeiled<T extends object> = Veil<T> & T;

const project = new Project(1);

const veiledProject: TVeiled<Projetc> = new Veil(project, { name: 'foo', author: 'yegor256' });

console.log(veiledProject.name()); // Outputs: "foo" (preset value)
console.log(veiledProject.author()); // Outputs: "yegor256" (preset value)

console.log(veiledProject.description()); // Pierces the veil and fetches from `project`
console.log(veiledProject.name()); // Now fetches via `project`, no longer uses preset

try {
  console.log((veiledProject as any).unknownMethod());
}
catch (error) {
  console.error(error.message); // Outputs an error message
}