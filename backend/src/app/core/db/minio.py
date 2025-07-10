import logging
import time
from minio import Minio
from minio.error import S3Error
from urllib3.util.retry import Retry
from urllib3 import PoolManager
from ..config import settings
from datetime import timedelta

logger = logging.getLogger(__name__)

class MinioClient:
    _instance = None
    _client = None
    _is_available = False
    _max_retries: int = 5
    _retry_delay: float = 1.0

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def init(self):
        """Initialize MinIO client with retry mechanism."""
        if self._client:
            return
            
        last_error = None
        for attempt in range(self._max_retries):
            try:
                # Disable urllib3 retry to avoid duplicate retry messages
                retry_strategy = Retry(total=0)  # No retry
                http_client = PoolManager(retries=retry_strategy)
                
                self._client = Minio(
                    settings.MINIO_ENDPOINT,
                    access_key=settings.MINIO_ACCESS_KEY,
                    secret_key=settings.MINIO_SECRET_KEY,
                    secure=settings.MINIO_SECURE,
                    http_client=http_client
                )
                # Check bucket, create if not exists
                if not self._client.bucket_exists(settings.MINIO_BUCKET_NAME):
                    self._client.make_bucket(settings.MINIO_BUCKET_NAME)
                self._is_available = True
                logger.info("MinIO connection initialized successfully")
                return
            except Exception as e:
                last_error = e
                if attempt < self._max_retries - 1:
                    logger.warning(f"MinIO retry {attempt + 1}/{self._max_retries}: {e}")
                    time.sleep(self._retry_delay)
                else:
                    self._is_available = False
                    logger.error(f"MinIO connection failed after {self._max_retries} attempts: {last_error}")
                    # Don't raise exception to prevent server crash

    def is_available(self):
        """Check if MinIO is available."""
        return self._is_available

    def get_client(self):
        """Get MinIO client instance."""
        return self._client if self._is_available else None

    def _ensure_connection(self):
        """Ensure MinIO connection is available."""
        if not self._is_available:
            self.init()
        return self._is_available

    def health_check(self):
        """Check MinIO connection health."""
        if not self._client:
            self.init()
        if not self._client:
            return False
            
        try:
            self._client.list_buckets()
            self._is_available = True
            return True
        except Exception as e:
            self._is_available = False
            logger.error(f"MinIO health check failed: {e}")
            return False

    def upload_file(self, file_data, file_name, content_type="application/octet-stream", length=None):
        """Upload file to MinIO."""
        if not self._ensure_connection():
            return False
            
        try:
            if self._client:
                if length is None:
                    try:
                        pos = file_data.tell()
                        file_data.seek(0, 2)
                        length = file_data.tell()
                        file_data.seek(pos)
                    except Exception:
                        logger.error("Cannot determine file length for upload. Please provide 'length' parameter.")
                        return False
                        
                self._client.put_object(
                    settings.MINIO_BUCKET_NAME,
                    file_name,
                    file_data,
                    length=length,
                    part_size=10*1024*1024,
                    content_type=content_type
                )
                logger.info(f"Uploaded file {file_name} to MinIO bucket {settings.MINIO_BUCKET_NAME}")
                return True
            return False
        except S3Error as e:
            logger.error(f"S3Error uploading file {file_name}: {e}")
            return False
        except Exception as e:
            logger.error(f"Error uploading file {file_name}: {e}")
            return False

    def download_file(self, file_name, file_path=None):
        """Download file from MinIO to local (if file_path=None, return bytes)."""
        if not self._ensure_connection():
            return None
            
        try:
            if self._client:
                response = self._client.get_object(settings.MINIO_BUCKET_NAME, file_name)
                data = response.read()
                if file_path:
                    with open(file_path, 'wb') as f:
                        f.write(data)
                    logger.info(f"Downloaded file {file_name} to {file_path}")
                    return file_path
                logger.info(f"Downloaded file {file_name} as bytes")
                return data
            return None
        except Exception as e:
            logger.error(f"Error downloading file {file_name}: {e}")
            return None

    def delete_file(self, file_name):
        """Delete file from MinIO bucket."""
        if not self._ensure_connection():
            return False
            
        try:
            if self._client:
                self._client.remove_object(settings.MINIO_BUCKET_NAME, file_name)
                logger.info(f"Deleted file {file_name} from MinIO bucket {settings.MINIO_BUCKET_NAME}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting file {file_name}: {e}")
            return False

    def update_file(self, file_data, file_name, content_type="application/octet-stream", length=None):
        """Update file (overwrite old file)."""
        return self.upload_file(file_data, file_name, content_type, length)

    def get_presigned_url(self, file_name, expires=3600):
        """Get a presigned temporary access URL for a file."""
        if not self._ensure_connection():
            return None
            
        try:
            if self._client:
                url = self._client.presigned_get_object(
                    settings.MINIO_BUCKET_NAME,
                    file_name,
                    expires=timedelta(seconds=expires)
                )
                logger.info(f"Generated presigned url for {file_name}")
                return url
            return None
        except Exception as e:
            logger.error(f"Error generating presigned url for {file_name}: {e}")
            return None

    def file_exists(self, file_name):
        """Check if a file exists in MinIO bucket."""
        if not self._ensure_connection():
            return False
            
        try:
            if self._client:
                self._client.stat_object(settings.MINIO_BUCKET_NAME, file_name)
                return True
            return False
        except S3Error as e:
            if e.code == 'NoSuchKey':
                return False
            logger.error(f"S3Error checking existence of file {file_name}: {e}")
            return False
        except Exception as e:
            logger.error(f"Error checking existence of file {file_name}: {e}")
            return False

    def list_files(self, prefix=""):
        """List files in the bucket with optional prefix."""
        if not self._ensure_connection():
            return []
            
        try:
            if self._client:
                objects = self._client.list_objects(settings.MINIO_BUCKET_NAME, prefix=prefix, recursive=True)
                file_list = [obj.object_name for obj in objects]
                logger.info(f"Listed files in bucket {settings.MINIO_BUCKET_NAME} with prefix '{prefix}'")
                return file_list
            return []
        except Exception as e:
            logger.error(f"Error listing files: {e}")
            return []

# Singleton instance
minio = MinioClient()
