import fs from 'fs';
import path from 'path';
import { bundleMDX } from 'mdx-bundler';

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), 'posts');

// COMPONENT_PATH
export const COMPONENT_PATH = path.join(POSTS_PATH, 'components');

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((folderPath) => /\.mdx?$/.test(folderPath));

export const prepareMdx = (sourcePath) => {
  const componentPathForPost = path.join(COMPONENT_PATH, sourcePath);
  let postComponentDirectory = [];
  try {
    postComponentDirectory = fs.readdirSync(componentPathForPost);
  } catch (e) {
    console.log('No components for post');
  }
  const files = postComponentDirectory.reduce((obj, compPath) => {
    const textContent = fs.readFileSync(path.join(componentPathForPost, compPath), 'utf-8');
    return {
      ...obj,
      [`./${compPath.replace(/\.js$/, '')}`]: textContent,
    };
  }, {});
  const mdxSource = fs.readFileSync(path.join(POSTS_PATH, sourcePath), 'utf-8');

  return bundleMDX({
    files,
    source: mdxSource,
  });
};
