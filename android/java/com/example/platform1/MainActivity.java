package com.example.platform1;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import android.graphics.BitmapFactory;
import android.os.Environment;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {
    private static final int PERMISSION_REQUEST_ALL = 1;
    private WebView webView;
    private ProgressBar progressBar;
    private static final String TAG = "WebViewDebug";
    private static final int REQUEST_IMAGE_CAPTURE = 1;
    private static final int PERMISSION_REQUEST_CAMERA = 100;
    private Uri photoURI;
    private String currentPhotoPath;
    // 全局异常处理程序
    private Thread.UncaughtExceptionHandler defaultUEH;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkAllPermissions();
        // 添加全局异常处理，便于调试闪退
        setupExceptionHandler();
        
        setContentView(R.layout.activity_main);

        initViews();
        setupWebView();
    }
    
    private void setupExceptionHandler() {
        defaultUEH = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((thread, ex) -> {
            Log.e(TAG, "未捕获异常: " + ex.getMessage(), ex);
            
            // 在这里可以记录异常详情或发送给服务器
            
            // 尝试恢复应用而不是闪退
            try {
                // 在非UI线程上发生的异常，尝试在UI线程上显示消息
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, 
                            "应用发生错误: " + ex.getMessage(), 
                            Toast.LENGTH_LONG).show();
                });
                
                // 延迟两秒后触发默认异常处理
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Log.e(TAG, "延迟触发默认异常处理时被中断", e);
            }
            
            // 最后仍然调用系统默认的异常处理
            defaultUEH.uncaughtException(thread, ex);
        });
    }

    private void initViews() {
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
    }

    private boolean checkCameraPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) 
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, 
                        new String[]{Manifest.permission.CAMERA}, 
                        PERMISSION_REQUEST_CAMERA);
                return false;
            }
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CAMERA) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 权限获取成功，打开相机
                dispatchTakePictureIntent();
            } else {
                Toast.makeText(this, "需要相机权限才能使用此功能", Toast.LENGTH_SHORT).show();
            }
        }
    }
    
    // 使用更安全的相机启动方法
    private void dispatchTakePictureIntent() {
    try {
        // 检查存储权限（针对Android 10及以下版本）
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.Q && 
            ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) 
            != PackageManager.PERMISSION_GRANTED) {
            
            ActivityCompat.requestPermissions(this, 
                new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 
                200);
            return;
        }
        
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        
        // 创建存储照片的文件
        File photoFile = null;
        try {
            photoFile = createImageFile();
        } catch (IOException ex) {
            Log.e(TAG, "创建图像文件时出错: " + ex.getMessage(), ex);
            Toast.makeText(this, "无法创建图像文件", Toast.LENGTH_SHORT).show();
            return;
        }
        
        if (photoFile != null && photoFile.exists()) {
            Log.d(TAG, "创建照片文件成功: " + photoFile.getAbsolutePath());
            
            // 使用FileProvider获取内容URI
            try {
                photoURI = FileProvider.getUriForFile(this,
                        getApplicationContext().getPackageName() + ".fileprovider",
                        photoFile);
                
                // 将URI传递给相机应用，以便保存完整分辨率照片
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
                Log.d(TAG, "启动相机，照片将保存到URI: " + photoURI);
                
                // 授予临时权限
                takePictureIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                takePictureIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                
                startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
            } catch (Exception e) {
                Log.e(TAG, "创建FileProvider URI时出错: " + e.getMessage(), e);
                Toast.makeText(this, "无法准备照片存储", Toast.LENGTH_SHORT).show();
            }
        } else {
            Log.e(TAG, "photoFile为空或不存在");
            Toast.makeText(this, "无法创建照片文件", Toast.LENGTH_SHORT).show();
        }
    } catch (Exception e) {
        Log.e(TAG, "启动相机Intent时发生异常: " + e.getMessage(), e);
        Toast.makeText(this, "相机启动失败: " + e.getMessage(), Toast.LENGTH_SHORT).show();
    }
}


private String bitmapToBase64(Bitmap bitmap) {
    try {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        // 使用更低的压缩质量以减小大小
        bitmap.compress(Bitmap.CompressFormat.JPEG, 70, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.DEFAULT);
    } catch (Exception e) {
        Log.e(TAG, "将位图转换为Base64时出错: " + e.getMessage(), e);
        return "";
    }
}
    // JavaScript接口类
    public class WebAppInterface {
        // 简化JavaScript接口，减少异常可能性
        @JavascriptInterface
        public void openCamera() {
            Log.d(TAG, "JavaScript调用了openCamera()");
            runOnUiThread(() -> {
                if (checkCameraPermission()) {
                    dispatchTakePictureIntent();
                }
            });
        }
    }
    private File createImageFile() throws IOException {
    // 创建唯一文件名
    String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", java.util.Locale.getDefault()).format(new Date());
    String imageFileName = "JPEG_" + timeStamp + "_";
    
    // 获取正确的存储目录
    File storageDir = null;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
    } else {
        storageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
    }
    
    if (!storageDir.exists()) {
        if (!storageDir.mkdirs()) {
            Log.e(TAG, "无法创建存储目录: " + storageDir.getAbsolutePath());
            throw new IOException("无法创建存储目录");
        }
    }
    
    // 创建临时文件
    File image = File.createTempFile(
            imageFileName,  /* 前缀 */
            ".jpg",         /* 后缀 */
            storageDir      /* 目录 */
    );
    
    // 检查文件是否可写
    if (!image.canWrite()) {
        Log.e(TAG, "无法写入文件: " + image.getAbsolutePath());
        throw new IOException("无法写入到目标文件");
    }
    
    // 保存文件路径，以便后续使用
    currentPhotoPath = image.getAbsolutePath();
    Log.d(TAG, "照片将保存到: " + currentPhotoPath);
    return image;
}
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    Log.d(TAG, "onActivityResult被调用: requestCode=" + requestCode + ", resultCode=" + resultCode);
    super.onActivityResult(requestCode, resultCode, data);
    
    if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
        try {
            Log.d(TAG, "相机返回成功");
            File photoFile = new File(currentPhotoPath);
            if (!photoFile.exists()) {
                Log.e(TAG, "照片文件不存在: " + currentPhotoPath);
                Toast.makeText(this, "照片文件不存在", Toast.LENGTH_SHORT).show();
                return;
            }

            Log.d(TAG, "照片文件大小: " + photoFile.length() + " 字节");
            if (photoFile.length() == 0) {
                Log.e(TAG, "照片文件为空: " + currentPhotoPath);
                Toast.makeText(this, "照片文件为空", Toast.LENGTH_SHORT).show();
                return;
            }
            
            // 在这种情况下，不使用data中的缩略图，而是从文件读取完整照片
            if (currentPhotoPath != null) {
                Log.d(TAG, "从文件加载照片: " + currentPhotoPath);
                
                // 添加照片到媒体库
                galleryAddPic();
                
                // 从文件加载完整分辨率照片
                Bitmap fullSizeBitmap = getBitmapFromPath(currentPhotoPath);
                
                if (fullSizeBitmap != null) {
                    Log.d(TAG, "成功加载照片，尺寸: " + fullSizeBitmap.getWidth() + "x" + fullSizeBitmap.getHeight());
                    
                    // 如果照片太大，调整大小以避免内存问题
                    Bitmap optimizedBitmap = getOptimizedBitmap(fullSizeBitmap);
                    Log.d(TAG, "优化后照片尺寸: " + optimizedBitmap.getWidth() + "x" + optimizedBitmap.getHeight());
                    
                    // 保存照片
                    Uri savedUri = saveImageWithMediaStore(optimizedBitmap);
                    if (savedUri != null) {
                        Log.d(TAG, "照片已通过MediaStore保存到媒体库: " + savedUri);
                        Toast.makeText(MainActivity.this, "照片已保存到相册", Toast.LENGTH_SHORT).show();
                    } else {
                        Log.e(TAG, "MediaStore保存失败");
                    }
                    
                    // 转换为Base64
                    final String base64Image = bitmapToBase64(optimizedBitmap);
                    if (base64Image != null && !base64Image.isEmpty()) {
                        Log.d(TAG, "照片已转为Base64，长度: " + base64Image.length());
                        
                        // 使用新方法显示照片
                        displayImageInWebView(base64Image);
                    } else {
                        Log.e(TAG, "Base64转换失败");
                    }
                } else {
                    Log.e(TAG, "无法加载照片文件");
                    
                    // 尝试直接使用文件作为备选
                    try {
                        Uri photoUri = Uri.fromFile(photoFile);
                        Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                        mediaScanIntent.setData(photoUri);
                        sendBroadcast(mediaScanIntent);
                        
                        Log.d(TAG, "已发送媒体扫描请求以添加照片: " + photoUri);
                        Toast.makeText(this, "已请求系统添加照片到相册", Toast.LENGTH_SHORT).show();
                    } catch (Exception e) {
                        Log.e(TAG, "处理照片文件失败: " + e.getMessage(), e);
                    }
                }
            } else {
                Log.e(TAG, "照片路径为空");
            }
        } catch (Exception e) {
            Log.e(TAG, "处理相机结果时出错: " + e.getMessage(), e);
            
            // 如果前面的处理出错，尝试从Intent数据获取缩略图
            try {
                if (data != null && data.hasExtra("data")) {
                    Bitmap thumbnail = (Bitmap) data.getExtras().get("data");
                    if (thumbnail != null) {
                        Log.d(TAG, "从Intent获取缩略图，尺寸: " + thumbnail.getWidth() + "x" + thumbnail.getHeight());
                        
                        // 保存缩略图
                        Uri savedUri = saveImageWithMediaStore(thumbnail);
                        if (savedUri != null) {
                            Log.d(TAG, "缩略图已保存: " + savedUri);
                        }
                        
                        // 显示缩略图
                        final String base64Image = bitmapToBase64(thumbnail);
                        if (base64Image != null && !base64Image.isEmpty()) {
                            displayImageInWebView(base64Image);
                        }
                    }
                }
            } catch (Exception ex) {
                Log.e(TAG, "处理缩略图失败: " + ex.getMessage(), ex);
            }
        }
    } else if (requestCode == REQUEST_IMAGE_CAPTURE) {
        Log.d(TAG, "相机操作未成功完成，resultCode=" + resultCode);
    }
}
    private void displayImageInWebView(final String base64Image) {
        if (base64Image == null || base64Image.isEmpty()) {
            Log.e(TAG, "base64Image为空，无法显示");
            return;
        }

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d(TAG, "准备在WebView中显示图片，base64长度: " + base64Image.length());

                    // 使用evaluateJavascript调用window.displayImage函数
                    String jsCode = "javascript:window.displayImage('" + base64Image + "')";
                    webView.evaluateJavascript(jsCode, new android.webkit.ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {
                            Log.d(TAG, "JavaScript执行结果: " + value);
                            if ("null".equals(value) || value == null) {
                                // 如果JavaScript函数调用失败，使用备用方法
                                loadImageDirectly(base64Image);
                            }
                        }
                    });
                } catch (Exception e) {
                    Log.e(TAG, "显示图片时出错: " + e.getMessage(), e);
                    // 出错时使用备用方法
                    loadImageDirectly(base64Image);
                }
            }
        });
    }

    // 备用方法：直接加载HTML以显示图片
    private void loadImageDirectly(String base64Image) {
        try {
            Log.d(TAG, "使用备用方法显示图片");
            String imgHtml = "<html><body style='margin:0;padding:0;display:flex;justify-content:center;align-items:center;'>" +
                    "<img src='data:image/jpeg;base64," + base64Image + "' style='max-width:100%;max-height:100%;'>" +
                    "</body></html>";
            webView.loadDataWithBaseURL(null, imgHtml, "text/html", "UTF-8", null);
        } catch (Exception e) {
            Log.e(TAG, "备用方法显示图片失败: " + e.getMessage(), e);
        }
    }
// 备份到应用内部存储
private void saveBitmapToInternalStorage(Bitmap bitmap, String fileName) {
    try {
        FileOutputStream fos = openFileOutput(fileName, MODE_PRIVATE);
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, fos);
        fos.close();
        Log.d(TAG, "已保存备份图片到内部存储: " + getFilesDir() + "/" + fileName);
    } catch (Exception e) {
        Log.e(TAG, "保存到内部存储失败: " + e.getMessage(), e);
    }
}

// 备用保存方法（返回URI）
private Uri saveToInternalStorageAsFallback(Bitmap bitmap) {
    try {
        String fileName = "IMG_" + System.currentTimeMillis() + ".jpg";
        FileOutputStream fos = openFileOutput(fileName, MODE_PRIVATE);
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, fos);
        fos.close();
        
        File file = new File(getFilesDir(), fileName);
        Log.d(TAG, "已保存图片到内部存储: " + file.getAbsolutePath());
        return Uri.fromFile(file);
    } catch (Exception e) {
        Log.e(TAG, "备用保存方法失败: " + e.getMessage(), e);
        return null;
    }
}
private Uri saveImageWithMediaStore(Bitmap bitmap) {
    try {
        ContentValues values = new ContentValues();
        String fileName = "IMG_" + System.currentTimeMillis() + ".jpg";
        values.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
        values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES);
            values.put(MediaStore.Images.Media.IS_PENDING, 1); // 标记为待处理，防止其他应用访问
        } else {
            File directory = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
            File file = new File(directory, fileName);
            values.put(MediaStore.Images.Media.DATA, file.getAbsolutePath());
        }
        
        Log.d(TAG, "尝试保存图片到MediaStore，文件名: " + fileName);
        Uri uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
        Log.d(TAG, "获取的URI: " + uri);
        
        if (uri != null) {
            try (OutputStream outputStream = getContentResolver().openOutputStream(uri)) {
                if (outputStream != null) {
                    boolean success = bitmap.compress(Bitmap.CompressFormat.JPEG, 90, outputStream);
                    Log.d(TAG, "图片压缩结果: " + success);
                    
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        values.clear();
                        values.put(MediaStore.Images.Media.IS_PENDING, 0); // 更新为完成状态
                        getContentResolver().update(uri, values, null, null);
                        Log.d(TAG, "已更新IS_PENDING状态");
                    }
                    
                    // 尝试直接保存一份到应用内部存储，作为备份
                    saveBitmapToInternalStorage(bitmap, fileName);
                    
                    return uri;
                } else {
                    Log.e(TAG, "获取输出流失败");
                }
            } catch (IOException e) {
                Log.e(TAG, "保存图片到MediaStore时IO异常: " + e.getMessage(), e);
            }
        } else {
            Log.e(TAG, "无法获取MediaStore URI");
        }
    } catch (Exception e) {
        Log.e(TAG, "使用MediaStore保存图像时出错: " + e.getMessage(), e);
    }
    
    // 如果MediaStore保存失败，尝试保存到内部存储
    return saveToInternalStorageAsFallback(bitmap);
}
    // 从文件路径加载位图
private Bitmap getBitmapFromPath(String path) {
    try {
        // 首先获取图像的尺寸，而不是加载完整图像
        BitmapFactory.Options bmOptions = new BitmapFactory.Options();
        bmOptions.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(path, bmOptions);
        
        // 获取图像尺寸
        int photoW = bmOptions.outWidth;
        int photoH = bmOptions.outHeight;
        Log.d(TAG, "原始照片尺寸: " + photoW + "x" + photoH);
        
        // 确定应缩小多少
        int scaleFactor = Math.max(1, Math.min(photoW/1080, photoH/1920));
        
        // 设置解码选项
        bmOptions.inJustDecodeBounds = false;
        bmOptions.inSampleSize = scaleFactor;
        
        // 解码文件
        return BitmapFactory.decodeFile(path, bmOptions);
    } catch (Exception e) {
        Log.e(TAG, "从路径加载位图失败: " + e.getMessage(), e);
        return null;
    }
}
private void checkAllPermissions() {
    ArrayList<String> permissions = new ArrayList<>();
    
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) 
            != PackageManager.PERMISSION_GRANTED) {
        permissions.add(Manifest.permission.CAMERA);
    }
    
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.Q && 
        ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) 
            != PackageManager.PERMISSION_GRANTED) {
        permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
    }
    
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.Q && 
        ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) 
            != PackageManager.PERMISSION_GRANTED) {
        permissions.add(Manifest.permission.READ_EXTERNAL_STORAGE);
    }
    
    if (permissions.size() > 0) {
        ActivityCompat.requestPermissions(this, 
            permissions.toArray(new String[0]), 
            PERMISSION_REQUEST_ALL);
    }
}
// 优化位图大小
private Bitmap getOptimizedBitmap(Bitmap bitmap) {
    try {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        
        // 如果图像太大，调整大小以适应内存
        float maxDimension = 1920.0f; // 最大尺寸
        
        if (width > maxDimension || height > maxDimension) {
            float scale = Math.min(maxDimension / width, maxDimension / height);
            int newWidth = Math.round(width * scale);
            int newHeight = Math.round(height * scale);
            
            return Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true);
        }
        
        return bitmap;
    } catch (Exception e) {
        Log.e(TAG, "优化位图失败: " + e.getMessage(), e);
        return bitmap;
    }
}

// 将照片添加到媒体库
private void galleryAddPic() {
    Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
    File f = new File(currentPhotoPath);
    Uri contentUri = Uri.fromFile(f);
    mediaScanIntent.setData(contentUri);
    sendBroadcast(mediaScanIntent);
    Log.d(TAG, "照片已添加到媒体库: " + currentPhotoPath);
}

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();

        // 基本设置
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // 缓存设置
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE); // 修改为不使用缓存
//        settings.setAppCacheEnabled(false);

        // 设置 UA
        String chromeUA = "Mozilla/5.0 (Linux; Android " + Build.VERSION.RELEASE + ") AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36";
        settings.setUserAgentString(chromeUA);

        // 其他设置
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        // 允许混合内容
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        }

        // Chrome调试
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        // 添加JavaScript接口
        webView.addJavascriptInterface(new WebAppInterface(), "Android");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {

                if (progressBar != null) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                    if (newProgress == 100) {
                        progressBar.setVisibility(View.GONE);
                    }
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(TAG, "Console: " + consoleMessage.message());
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            private int loadRetryCount = 0;
            private static final int MAX_RETRY_COUNT = 3;

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                Log.d(TAG, "开始加载页面: " + url);
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                Log.d(TAG, "页面加载完成: " + url);
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e(TAG, "加载错误: " + description + " URL: " + failingUrl);
                if (loadRetryCount < MAX_RETRY_COUNT) {
                    loadRetryCount++;
                    view.reload();
                } else {
                    Toast.makeText(MainActivity.this, "加载失败: " + description, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    Log.e(TAG, "HTTP错误: " + request.getUrl() + " 状态码: " + errorResponse.getStatusCode());
                }
                super.onReceivedHttpError(view, request, errorResponse);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                Log.d(TAG, "SSL错误: " + error.toString());
                handler.proceed(); // 注意：在生产环境中应该适当处理SSL错误
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Log.d(TAG, "正在处理URL: " + url);

                // 处理特殊URL
                if (url.startsWith("tel:") || url.startsWith("mailto:") ||
                        url.startsWith("geo:") || url.startsWith("whatsapp:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        Log.e(TAG, "处理特殊URL时出错", e);
                    }
                }

                // 处理普通URL
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    view.loadUrl(url);
                    return true;
                }

                return false;
            }
        });

        // 加载本地HTML文件
        Log.d(TAG, "开始加载本地HTML文件");
        webView.loadUrl("file:///android_asset/camera.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.clearHistory();
            webView.clearCache(true);
            webView.loadUrl("about:blank");
            webView.onPause();
            webView.removeAllViews();
            webView.destroyDrawingCache();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}