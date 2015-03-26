#include "HeySDKConfig.h"
#include "HeyApplication.h"

/**
 @brief    Implement Director and Scene init code here.
 @return true    Initialize success, app continue.
 @return false   Initialize failed, app terminate.
 */
bool HeyApplication::applicationDidFinishLaunching()
{
    heysdk::HeySDKConfig config;
    
    config.appid = HEYSDK_APPID;
    config.platform = HEYSDK_PLATFORM;
    config.channel = HEYSDK_CHANNEL;
    
#ifdef HEYSDK_ALLOW_AUTOLOGIN
    config.isAllowAutoLogin = (HEYSDK_ALLOW_AUTOLOGIN > 0);
#endif
    
#ifdef HEYSDK_ALLOW_DEVICEIDLOGIN
    config.isAllowDeviceIDLogin = (HEYSDK_ALLOW_DEVICEIDLOGIN > 0);
#endif 
    
#ifdef HEYSDK_ALLOW_MULACCOUNT
    config.isAllowMulAccount = (HEYSDK_ALLOW_MULACCOUNT > 0);
#endif 
    
    heysdk::HeySDK::getSingleton()->setConfig(config);
    
    heysdk::HeySDK::getSingleton()->init();

    cocos2d::Scheduler* scheduler = cocos2d::Director::getInstance()->getScheduler();
    scheduler->schedule(schedule_selector(HeyApplication::onIdle), this, 0.0f, CC_REPEAT_FOREVER, 0.0f, false);
    
    heysdk::HeySDKClient::getSingleton()->requestConfig(HEYSDK_APPID, HEYSDK_PLATFORM, HEYSDK_CHANNEL);
    
    if (heysdk::HeySDK::getSingleton()->getConfig().isAllowAutoLogin)
        heysdk::HeySDK::getSingleton()->autologin();
    
    return true;
}

/**
 @brief  The function be called when the application enter background
 @param  the pointer of the application
 */
void HeyApplication::applicationDidEnterBackground()
{
    
}

/**
 @brief  The function be called when the application enter foreground
 @param  the pointer of the application
 */
void HeyApplication::applicationWillEnterForeground()
{
    
}

void HeyApplication::onIdle(float dt)
{
    heysdk::HeySDK::getSingleton()->onIdle();
}