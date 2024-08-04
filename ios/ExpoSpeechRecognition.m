#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SpeechRecognizer, NSObject)

RCT_EXTERN_METHOD(startRecognition:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopRecognition:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end