#ifndef __HEYSDK_HEYAPPLICATION_H__
#define __HEYSDK_HEYAPPLICATION_H__

#include "cocos2d.h"
#include "HeySDK.h"
#include "HeySDKClient.h"

class HeyApplication : public cocos2d::Application, cocos2d::Ref
{
public:
    HeyApplication() {}
    virtual ~HeyApplication() {}
    
    /**
     @brief    Implement Director and Scene init code here.
     @return true    Initialize success, app continue.
     @return false   Initialize failed, app terminate.
     */
    virtual bool applicationDidFinishLaunching();
    
    /**
     @brief  The function be called when the application enter background
     @param  the pointer of the application
     */
    virtual void applicationDidEnterBackground();
    
    /**
     @brief  The function be called when the application enter foreground
     @param  the pointer of the application
     */
    virtual void applicationWillEnterForeground();
public:
    void onIdle(float dt);
};

#endif // __HEYSDK_HEYAPPLICATION_H__
