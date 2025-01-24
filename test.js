import Veil from "./veil.js";

class Project {
  constructor(offerId) {
    this.offerId = offerId;
  };

  name() {
    return 'name';
  }

  author() {
    return 'author';
  }

  description() {
    return 'description';
  }
};

const veiledProject = new Veil(
  new Project('id'),
  { name: 'project-1', author: 'Alex' },
);

console.log('Assert that the veil object uses provide preset object');

console.log( veiledProject.name() === 'project-1' );
console.log( veiledProject.author() === 'Alex' );

console.log('Assert that the methods call passes through to the target object after piercing');

console.log( veiledProject.description() === 'description' );
console.log( veiledProject.name() === 'name' );