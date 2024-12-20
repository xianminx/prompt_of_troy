/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="react" />

// Add this to fix JSX typing issues
import React from 'react'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
