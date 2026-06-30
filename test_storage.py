import boto3
from botocore.client import Config
import requests

# Credentials and config
ACCESS_KEY = "2692826f5b24c48e7649c70f26c55bca87d47470"
SECRET_KEY = "4wm4fNqwbEso3Pi0huRs5GIUoZ2njoFE8l5dFQ0kCac="
NAMESPACE = "bmpwz8jwzqdl"
REGION = "ap-mumbai-1"
BUCKET_NAME = "DKGL-BUCKET1"

endpoint_url = f"https://{NAMESPACE}.compat.objectstorage.{REGION}.oraclecloud.com"

# Initialize the S3 client
s3_client = boto3.client(
    's3',
    region_name=REGION,
    endpoint_url=endpoint_url,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    config=Config(signature_version='s3v4', s3={'addressing_style': 'path'})
)

def test_connection():
    try:
        file_content = b"Hello from Trip Planner Object Storage!"
        file_name = "hello_oracle.txt"
        
        print("1. Generating Pre-signed URL for upload...")
        
        # Generate a pre-signed URL for uploading (this handles the authentication signature perfectly)
        presigned_url = s3_client.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': file_name
            },
            ExpiresIn=3600
        )
        
        print(f"2. Uploading file using standard HTTP PUT to bypass AWS chunking...")
        
        # Upload the file using standard requests
        response = requests.put(presigned_url, data=file_content)
        
        if response.status_code == 200:
            print("\n[SUCCESS] File successfully uploaded to Oracle Cloud!")
            
            print("3. Listing objects in bucket to verify...")
            list_response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
            for obj in list_response.get('Contents', []):
                print(f"   - Found file: {obj['Key']} ({obj['Size']} bytes)")
        else:
            print(f"\n[ERROR] Upload failed with status code: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n[ERROR] Error connecting to Oracle Cloud:\n{e}")

if __name__ == "__main__":
    test_connection()
