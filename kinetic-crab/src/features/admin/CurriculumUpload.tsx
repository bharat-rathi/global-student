import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionStore } from '../../store/useQuestionStore';
import { generateQuestionsFromText } from '../../lib/gemini';

export const CurriculumUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { apiKey, addQuestions } = useQuestionStore();

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
        if (droppedFile && (droppedFile.type === 'text/plain' || droppedFile.name.endsWith('.txt'))) {
            setFile(droppedFile);
            setUploadStatus('idle');
            setErrorMessage('');
        } else {
            setErrorMessage('For this prototype, please upload .txt files only.');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadStatus('idle');
            setErrorMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        if (!apiKey) {
            setErrorMessage('Please save your Gemini API Key above first.');
            return;
        }

        setUploadStatus('uploading');

        try {
            // Read file content
            const text = await file.text();

            setUploadStatus('processing');

            // Generate questions
            const newQuestions = await generateQuestionsFromText(apiKey, text);

            // Save to store
            addQuestions(newQuestions);

            setUploadStatus('success');

            // Reset after 3 seconds
            setTimeout(() => {
                setFile(null);
                setUploadStatus('idle');
            }, 3000);

        } catch (error) {
            console.error(error);
            setUploadStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to process file');
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-slate-700 bg-slate-900/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Upload className="w-5 h-5 text-blue-400" />
                    Upload Curriculum
                </CardTitle>
                <CardDescription>
                    Upload a text file (.txt) to automatically generate game questions using AI.
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
                            accept=".txt"
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
                                    Supports .txt files (Max 30KB text)
                                </p>
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle className="w-4 h-4" />
                            {errorMessage}
                        </div>
                    )}

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
                                                {(file.size / 1024).toFixed(2)} KB
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
                                            <span className="text-sm font-medium">Generated!</span>
                                        </div>
                                    )}
                                </div>

                                {uploadStatus === 'idle' && (
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Questions
                                        </Button>
                                    </div>
                                )}

                                {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {uploadStatus === 'uploading' ? 'Reading file...' : 'AI Generating Questions...'}
                                        </div>
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
