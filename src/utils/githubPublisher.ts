/**
 * Client-Side GitHub Pages API Publisher
 * Allows Ida to push updates directly to GitHub from her online browser session
 * with zero server, zero Vercel, and zero Netlify!
 */

export interface GitHubSyncConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export interface PublishProgressCallback {
  (status: { message: string; step: number; total: number; success?: boolean; error?: string }): void;
}

/**
 * Validates a GitHub Personal Access Token and checks repo access
 */
export async function testGitHubAccess(config: GitHubSyncConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { success: false, error: 'Invalid GitHub Token. Please check that your token has repository read/write permissions.' };
      }
      if (res.status === 404) {
        return { success: false, error: `Repository "${config.owner}/${config.repo}" not found or token lacks access.` };
      }
      return { success: false, error: `GitHub error: HTTP ${res.status} ${res.statusText}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network connection failed.' };
  }
}

/**
 * Gets the current SHA of a file in the repo (needed for updating existing files)
 */
async function getFileSha(config: GitHubSyncConfig, path: string): Promise<string | undefined> {
  try {
    const res = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
  } catch {
    // File doesn't exist yet, return undefined
  }
  return undefined;
}

/**
 * Pushes a single file to GitHub via the Contents API
 */
async function pushFile(
  config: GitHubSyncConfig,
  path: string,
  content: string,
  commitMessage: string
): Promise<boolean> {
  const sha = await getFileSha(config, path);

  // UTF-8 safe base64 encoding
  const utf8Bytes = new TextEncoder().encode(content);
  let binary = '';
  for (let i = 0; i < utf8Bytes.byteLength; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  const base64Content = btoa(binary);

  const payload: any = {
    message: commitMessage,
    content: base64Content,
    branch: config.branch,
  };
  if (sha) {
    payload.sha = sha;
  }

  const res = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || `Failed to write ${path}: HTTP ${res.status}`);
  }

  return true;
}

/**
 * Commits all generated portfolio files directly to GitHub Pages repository
 */
export async function publishPortfolioToGitHub(
  config: GitHubSyncConfig,
  files: Array<{ path: string; content: string }>,
  onProgress?: PublishProgressCallback
): Promise<void> {
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress({
        message: `Publishing ${file.path}...`,
        step: i + 1,
        total,
      });
    }

    await pushFile(
      config,
      file.path,
      file.content,
      `Update ${file.path} via Portfolio Studio`
    );
  }

  if (onProgress) {
    onProgress({
      message: 'All files published live to GitHub Pages!',
      step: total,
      total,
      success: true,
    });
  }
}
