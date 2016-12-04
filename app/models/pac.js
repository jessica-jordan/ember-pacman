import Ember from 'ember';
import SharedStuff from '../mixins/shared-stuff';

export default Ember.Object.extend(SharedStuff, {
  direction: 'down',
  intent: 'down',

  x: 0,
  y: 0,

  draw(){
    let x = this.get('x');
    let y = this.get('y');
    
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor, this.get('direction'));
  },
  
  move(){
    if(this.animationCompleted()){
      this.finalizeMove();
      this.changeDirection();
    }
    else if (this.get('direction') === 'stopped') {
      this.changeDirection();
    }
    else {
      this.incrementProperty('frameCycle');
    }
  },

  animationCompleted(){
    return this.get('frameCycle') === this.get('framesPerMovement');
  },

  finalizeMove(){
    let direction = this.get('direction');
    this.set('x', this.nextCoordinate('x', direction));
    this.set('y', this.nextCoordinate('y', direction));

    this.set('frameCycle', 1);
  },

  changeDirection(){
    let intent = this.get('intent');
    if(this.pathBlockedInDirection(intent)){
      this.set('direction', 'stopped');
    }
    else {
      this.set('direction', intent);
    }
  },

  pathBlockedInDirection(direction){
    let cellTypeInDirection = this.cellTypeInDirection(direction);

    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection(direction){
    let nextX = this.nextCoordinate('x', direction);
    let nextY = this.nextCoordinate('y', direction);

    // another 15mins to find out that the grid is now defined on the level model 
    return this.get(`level.grid.${nextY}.${nextX}`);
  },
 
  nextCoordinate(coordinate, direction){
    return this.get(coordinate) + this.get(`directions.${direction}.${coordinate}`);
  },

  restart(){
    this.set('x',0);
    this.set('y',0);
    this.set('frameCycle', 0);
    this.set('direction', 'stopped');
  }
});
