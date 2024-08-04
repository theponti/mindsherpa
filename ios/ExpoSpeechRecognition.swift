// SpeechRecognizer.swift

import Foundation
import Speech

@objc(SpeechRecognizer)
class SpeechRecognizer: NSObject {
  private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))!
  private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
  private var recognitionTask: SFSpeechRecognitionTask?
  private let audioEngine = AVAudioEngine()
  
  @objc func startRecognition(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    SFSpeechRecognizer.requestAuthorization { authStatus in
      OperationQueue.main.addOperation {
        switch authStatus {
        case .authorized:
          do {
            try self.startRecording(resolve: resolve, reject: reject)
          } catch {
            reject("ERROR_RECORDING", "Unable to start recording", error)
          }
        case .denied:
          reject("PERMISSION_DENIED", "Speech recognition permission denied", nil)
        case .restricted, .notDetermined:
          reject("PERMISSION_NOT_DETERMINED", "Speech recognition not authorized", nil)
        @unknown default:
          reject("UNKNOWN_ERROR", "Unknown authorization status", nil)
        }
      }
    }
  }
  
  private func startRecording(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) throws {
    recognitionTask?.cancel()
    self.recognitionTask = nil
    
    let audioSession = AVAudioSession.sharedInstance()
    try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
    try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
    
    recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
    
    let inputNode = audioEngine.inputNode
    guard let recognitionRequest = recognitionRequest else {
      throw NSError(domain: "SpeechRecognizer", code: 1, userInfo: nil)
    }
    
    recognitionRequest.shouldReportPartialResults = true
    
    recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest) { result, error in
      if let result = result {
        resolve(result.bestTranscription.formattedString)
      }
      if error != nil {
        self.audioEngine.stop()
        inputNode.removeTap(onBus: 0)
        self.recognitionRequest = nil
        self.recognitionTask = nil
      }
    }
    
    let recordingFormat = inputNode.outputFormat(forBus: 0)
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer: AVAudioPCMBuffer, when: AVAudioTime) in
      self.recognitionRequest?.append(buffer)
    }
    
    audioEngine.prepare()
    try audioEngine.start()
  }
  
  @objc func stopRecognition(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    audioEngine.stop()
    recognitionRequest?.endAudio()
    recognitionTask?.cancel()
    
    audioEngine.inputNode.removeTap(onBus: 0)
    recognitionRequest = nil
    recognitionTask = nil
    
    resolve(nil)
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

