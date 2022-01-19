package com.example.mobiledevgame;

import androidx.appcompat.app.AppCompatActivity;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {

    WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        View decorView = getWindow().getDecorView();
        //Set the IMMERSIVE flag
        //Set the content to appear under the system bars so that the content doesn't resize when the system bars hide and show

        int uiOptions =  View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                |View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                |View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                |View.SYSTEM_UI_FLAG_HIDE_NAVIGATION //hide nav bar
                |View.SYSTEM_UI_FLAG_FULLSCREEN      //hide status bar
                |View.SYSTEM_UI_FLAG_IMMERSIVE;

        decorView.setSystemUiVisibility(uiOptions);

        setContentView(R.layout.activity_main);

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        // Set WebView context
        webView = (WebView)findViewById(R.id.webview1);
        // Enable Html editing within WebView
        webView.getSettings().setJavaScriptEnabled(true);
        //Enter Java file here
        webView.loadUrl("file:///android_asset/mainMenu.html");

    }
}