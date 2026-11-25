import { pathToFileURL } from 'node:url';
const moduleURL = pathToFileURL('/home/ubuntu/AI-round/analysis/p7-idea/app/public/vendor/three/build/three.module.js').href;
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'three') return { url: moduleURL, shortCircuit: true };
  return nextResolve(specifier, context);
}
