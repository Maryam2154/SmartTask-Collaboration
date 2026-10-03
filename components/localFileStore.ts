export type LocalFileMetadata = {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
};

type StoredLocalFile = LocalFileMetadata & { blob: Blob };

const databaseName = 'smarttask-browser-files';
const storeName = 'uploads';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open local file storage.'));
  });
}

export async function listLocalFiles(): Promise<LocalFileMetadata[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(storeName, 'readonly').objectStore(storeName).getAll();
    request.onsuccess = () => resolve((request.result as StoredLocalFile[]).map(({ id, name, type, size, lastModified }) => ({ id, name, type, size, lastModified })));
    request.onerror = () => reject(request.error ?? new Error('Unable to read local files.'));
    request.transaction?.addEventListener('complete', () => database.close(), { once: true });
  });
}

export async function saveLocalFile(file: File): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put({ id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, lastModified: file.lastModified, blob: file } satisfies StoredLocalFile);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error ?? new Error(`Unable to store ${file.name}.`)); };
    transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error(`Unable to store ${file.name}.`)); };
  });
}

export async function readLocalFile(id: string): Promise<Blob | null> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(storeName, 'readonly').objectStore(storeName).get(id);
    request.onsuccess = () => resolve((request.result as StoredLocalFile | undefined)?.blob ?? null);
    request.onerror = () => reject(request.error ?? new Error('Unable to read the selected file.'));
    request.transaction?.addEventListener('complete', () => database.close(), { once: true });
  });
}