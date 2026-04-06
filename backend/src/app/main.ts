import { composeInMemoryApp } from './composition';

const app = composeInMemoryApp();

console.log('DGLEA backend composition ready.');
console.log('Endpoints wired:', Object.keys(app));
