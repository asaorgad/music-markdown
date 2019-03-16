import { REPOS_LOCAL_STORAGE_KEY, GITHUB_TOKEN_LOCAL_STORAGE_KEY, GITHUB_API_URL } from './constants';

/**
 * Returns a Promise of the contents of a file or directory in a GitHub repository.
 * See https://developer.github.com/v3/repos/contents/#get-contents
 * @param {string} owner Account owner of the repo
 * @param {string} repo Repo name
 * @param {string} path The directory or file to retrieve
 * @param {string} branch The branch to retrive contents from
 * @return {Object} JSON dictionary of repository contents
 */
export async function getContents(owner, repo, path, branch) {
  if (path === undefined || path.length === 0) {
    path = '';
  }
  const apiUrl = getApiUrl(`/repos/${owner}/${repo}/contents/${path}`, branch);
  const response = await fetch(apiUrl);
  return response.json();
}

/**
 * Returns list of repos stored in localStorage.
 * @return {Array} Array of JSON dictionaries of repos
 */
export function getRepositories() {
  const repoListStr = localStorage.getItem(REPOS_LOCAL_STORAGE_KEY);
  if (repoListStr) {
    return JSON.parse(repoListStr);
  } else {
    return [];
  }
}

/**
 * Returns a promise of a list of branches for the given repository.
 * @param {string} owner Account owner of the repo
 * @param {string} repo Repo name
 */
export async function getBranches(owner, repo) {
  const apiUrl = getApiUrl(`/repos/${owner}/${repo}/branches`);
  const response = await fetch(apiUrl);

  return response.json();
}

/**
 * Adds a desired GitHub repo to localStorage.
 * @param {string} owner Repo owner
 * @param {string} repo Repo name
 * @param {string} path Subdirectory
 * @param {string} branch Branch name
 */
export function addRepository(owner, repo, path, branch) {
  const repoMap = { owner, repo, path, branch };
  const storedRepos = getRepositories();
  const repoList = storedRepos.length > 0 ? storedRepos : [];
  repoList.push(repoMap);
  localStorage.setItem(REPOS_LOCAL_STORAGE_KEY, JSON.stringify(repoList));
}

/**
 * Composes the GitHub API url for the given url, attaching the user's GitHub
 * access token if it exists.
 * @param {string} url The path and search params
 * @param {string} branch The branch to get from
 * @return {URL} Composed GitHub API url with user's personal access token
 */
export function getApiUrl(url, branch) {
  url = new URL(url, GITHUB_API_URL);

  const githubToken = localStorage.getItem(GITHUB_TOKEN_LOCAL_STORAGE_KEY);
  if (githubToken) {
    url.searchParams.set('access_token', githubToken);
  }

  if (branch) {
    url.searchParams.set('ref', branch);
  }

  return url;
}