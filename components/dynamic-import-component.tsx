import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./problematic-component').then((mod) => mod.default || mod), {
  ssr: false, // Set to true if you want server-side rendering
});

// Use DynamicComponent in your JSX

