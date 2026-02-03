// patterns/Observer.js

// Observer interface-like base class
export class Observer {
  update(event, data) {
    throw new Error('Update method must be implemented');
  }
}

// Subject (Observable)
export class LibraryEventPublisher {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    if (observer instanceof Observer) {
      this.observers.push(observer);
    } else {
      throw new Error('Observer must extend Observer class');
    }
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(event, data) {
    this.observers.forEach(observer => observer.update(event, data));
  }
}

// Concrete Observer: Email Notification
export class EmailNotificationObserver extends Observer {
  update(event, data) {
    console.log(`[EMAIL] Event: ${event}`);
    console.log(`[EMAIL] Sending notification to: ${data.email || 'library@example.com'}`);
    console.log(`[EMAIL] Details: ${JSON.stringify(data, null, 2)}`);
  }
}

// Concrete Observer: Log Notification
export class LogNotificationObserver extends Observer {
  update(event, data) {
    const timestamp = new Date().toISOString();
    console.log(`[LOG] ${timestamp} - Event: ${event}`);
    console.log(`[LOG] Data: ${JSON.stringify(data, null, 2)}`);
  }
}

// Concrete Observer: SMS Notification
export class SMSNotificationObserver extends Observer {
  update(event, data) {
    console.log(`[SMS] Event: ${event}`);
    console.log(`[SMS] Sending SMS notification`);
    console.log(`[SMS] Message: ${data.message || 'Library notification'}`);
  }
}
