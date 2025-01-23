# VeilObjects
The JS/TS implementation of Veil objects approach from EO oriented programming

> Notice that the package is under active development currently.

## Objectives
See original paper which this package idea is based upon - https://www.yegor256.com/2020/05/19/veil-objects.html

The objective is to use the EO oriented programming so callsed: "Veil objects" approach in JS/TS

## Contributing

See all you need here: https://gadzhievislam.org/Programming/Contributing

### Issues

You're welcome to submit any issues related to existing issues tags, and start to work on existing.

### Pull-requests

## Usage
The veil object wraps a target object with provided presets object and when trying to access the provided presets methods on the veil object 0 it passes them throuhg, until the veil object is pierced, meaning the use methods not listed in the provided preset object.

See the example below in TypeScript:

```TypeScript
// Create a Project class with dynamic methods

type TDBFetcher = (field: string, id: number) => string;

class Project {
  constructor(
    private readonly dataFetcher: TDBFetcher,
    private readonly id: number
  ) {
    this.dataFetcher = dataFetcher;
    this.id = id;
  }

  name(): string {
    return this.dataFetcher("name", this.id);
  }

  author(): string {
    return this.dataFetcher("author", this.id);
  }

  description(): string {
    return this.dataFetcher("description", this.id);
  }
};

// Now let's try to use our Veil object

const veiledProject = new Veil(
  new Project(fetchData, 1),
  { name: 'project-1', author: 'Alex' },
);

// Call methods on the veiled object
console.log( veiledProject.name() ); // Outputs: "project-1" (preset value)
console.log( veiledProject.author() ); // Outputs: "Alex" (preset value)

// Accessing a non-preset method pierces the veil
console.log( veiledProject.description() ); // Pierces the veil and fetches from `project`

// Now fetches via target object native method: `project.name()`, no longer uses preset
// Outputs: "project.name()", wher `project` is `new Project()` from the Veil target
console.log( veiledProject.name() );
```