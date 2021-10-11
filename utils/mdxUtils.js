import fs from 'fs';
import path from 'path';
import { bundleMDXFile } from 'mdx-bundler';

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), 'posts');

// COMPONENT_PATH
export const COMPONENT_PATH = path.join(process.cwd(), 'components/mdx');

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((folderPath) => /\.mdx?$/.test(folderPath));

export const prepareMdx = (sourcePath) => {
  const files = fs.readdirSync(COMPONENT_PATH).reduce((obj, compPath) => {
    const textContent = fs.readFileSync(path.join(COMPONENT_PATH, compPath), 'utf-8');
    return { ...obj, [`./${compPath.replace(/\.js$/, '')}`]: textContent.replace(/\n/g, '') };
  }, {});
  return bundleMDXFile(sourcePath, { files });
};
