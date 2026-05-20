from fastapi import APIRouter, UploadFile, File
import cloudinary
import cloudinary.uploader

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):

    result = cloudinary.uploader.upload(file.file)

    return {
        "url": result["secure_url"]
    }