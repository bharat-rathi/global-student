import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CurriculumUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
            setFile(droppedFile);
            setUploadStatus('idle');
        } else {
            alert('Please upload a PDF or DOCX file.');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadStatus('idle');
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setUploadStatus('uploading');

        // Simulate upload delay
        setTimeout(() => {
            setUploadStatus('success');
            // Reset after 3 seconds
            setTimeout(() => {
                setFile(null);
                setUploadStatus('idle');
            }, 3000);
        }, 2000);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-slate-700 bg-slate-900/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Upload className="w-5 h-5 text-blue-400" />
                    Upload Curriculum
                </CardTitle>
                <CardDescription>
                    Update the learning materials by uploading new documents (PDF, DOCX).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                            ${isDragging
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                            }
                        `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx"
                            onChange={handleFileSelect}
                        />

                        <div className="flex flex-col items-center gap-4">
                            <div className={`p-4 rounded-full bg-slate-800 ${isDragging ? 'scale-110' : ''} transition-transform`}>
                                <Upload className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-white">
                                    {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Supports PDF and DOCX (Max 10MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* File Preview & Status */}
                    <AnimatePresence>
                        {file && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <FileText className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>

                                    {uploadStatus === 'idle' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="text-muted-foreground hover:text-red-400"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}

                                    {uploadStatus === 'success' && (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="text-sm font-medium">Uploaded</span>
                                        </div>
                                    )}
                                </div>

                                {uploadStatus === 'idle' && (
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                                            Upload Document
                                        </Button>
                                    </div>
                                )}

                                {uploadStatus === 'uploading' && (
                                    <div className="mt-4 space-y-2">
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2 }}
                                            />
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground">Uploading...</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};
