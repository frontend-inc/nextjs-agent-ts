const BASE_URL = 'https://cloud.frontend.co/api/storage';

const headers = () => ({
  'x-api-key': process.env.FRONTEND_API_KEY!,
});

export async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: headers(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function listFiles(): Promise<{ files: { url: string; filename: string }[] }> {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error(`List files failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const res = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: {
      ...headers(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: fileUrl }),
  });

  if (!res.ok) {
    throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
