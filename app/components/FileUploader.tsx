'use client';
import React, { useState } from 'react';
import { IKUpload } from 'imagekitio-next';
import { Loader2 } from 'lucide-react';
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props';

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: 'image' | 'video';
}

export default function FileUpload({ onSuccess, onProgress, fileType }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: { message: string }) => {
        console.log('Error', err);
        setError(err.message);
        setUploading(false);
        setError(null);
    };

    const handleSuccess = (response: IKUploadResponse) => {
        console.log('Success', response);
        setUploading(false);
        setError(null);
        onSuccess(response);
    };

    const handlePrgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentComplete));
        }
    };

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    };

    const validateFile = (file: File) => {
        if (fileType === 'video') {
            if (!file.type.startsWith('video/')) {
                setError('Please upload a video file');
                return false;
            }
            if (file.size > 100 * 1024 * 1024) {
                setError('Video must be less than 100 MB');
                return false;
            }
        } else {
            const validTypes = ['image/jped', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid file (jpg, png, webp)');
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Video must be less than 5 MB');
                return false;
            }
        }
        return false;
    };

    return (
        <div className="space-y-2">
            <IKUpload
                fileName="test-upload.jpg"
                useUniqueFileName={true}
                validateFile={validateFile}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handlePrgress}
                onUploadStart={handleStartUpload}
                folder={fileType === 'video' ? 'video/*' : 'images/*'}
                accept={fileType === 'video' ? 'video/*' : 'images/*'}
                className="file-input file-input-boardered w-full"
            />
            {uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Uploading....</span>
                </div>
            )}
            {
                error && (
                    <div className='text-error text-sm text-red-600'>
                        {error}
                    </div>
                )
            }
        </div>
    );
}
