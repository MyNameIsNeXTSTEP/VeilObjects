import Veil from '../../src/veil.js';
import Project from '../mocks/simpleTargetClass.js';

var eq = (comparing, comporator, info) => {
  if (comparing !== comporator) throw new Error(`Assertion failed: ${info}`);
}

tests({
  'test addition': function () {
    eq(2 + 2, 4, 'Basic addition works');
  },
  'test subtraction': function () {
    eq(4 - 2, 3, 'Basic subtraction doesnt work');
  }
});

var mockPresetsData = {
  name: 'project-1',
  author: 'Alex'
};

var veiledProject = new Veil(
  new Project('123'),
  mockPresetsData,
);

/**
 * Test cases
 */
// (
//   () => {
//     // console.log(`Assertion: Expected veil project name "${veiledProjectName}" to be "${mockPresetsData.name}"`);
//     var cases = [
//       {
//         condition: veiledProject.name() === mockPresetsData.name,
//         data: {
//           mockPresetsData,
//           // error: `"${veiledProjectName}" is not equal to "${mockPresetsData.name}"`
//         }
//       },
//       {
//         condition: veiledProject.author() === mockPresetsData.author,
//         data: mockPresetsData,
//       }
//     ];
//     assertMult(cases);
//   }
// )();

// console.log( veiledProject.name() === 'project-1' );
// console.log( veiledProject.author() === 'Alex' );

// console.log('Assertion: the methods call passes through to the target object after piercing.');

// console.log( veiledProject.description() === 'description' );
// console.log( veiledProject.name() === 'name' );