import Veil from '../../src/veil.js';
import Project from '../mocks/simpleTargetClass.js';
import assert from 'assert';

var mockPresetsData = {
  name: 'project-1',
  author: 'Alex'
};

var project = new Project('123');
var veiledProject = new Veil(project, mockPresetsData);

describe('Veiled object', function () {
  it('Non pierced: calling target object methods invokes presets data', function () {
    assert.equal(veiledProject.name(), mockPresetsData.name);
    assert.equal(veiledProject.author(), mockPresetsData.author);
  });
  it('Pierced: calling non-target object methods pierces the veil and invokes native target methods', function () {
    assert.equal(veiledProject.description(), 'description');
    assert.equal(veiledProject.name(), project.name());
  });
});
