#ifndef JSIStoreValueUser_h
#define JSIStoreValueUser_h

#include <stdio.h>
#include <memory>
#include <vector>
#include <unordered_map>
#include <jsi/jsi.h>
#include <mutex>
#include "Scheduler.h"

using namespace facebook;

namespace reanimated {

class RuntimeManager;

struct StaticStoreUser {
    std::atomic<int> ctr;
    std::unordered_map<int, std::vector<std::shared_ptr<jsi::Value>>> store;
    std::recursive_mutex storeMutex;
};

class StoreUser {
  int identifier = 0;
  std::weak_ptr<Scheduler> scheduler;
  std::shared_ptr<StaticStoreUser> storeUserData;
  
public:
  StoreUser(std::shared_ptr<Scheduler> s, RuntimeManager &runtimeManager);
  
  std::weak_ptr<jsi::Value> getWeakRef(jsi::Runtime &rt);
  void removeRefs();
  
  virtual ~StoreUser();
};

}

#endif /* JSIStoreValueUser_h */
