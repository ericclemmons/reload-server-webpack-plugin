import cluster from "cluster";
import expect from "expect";
import path from "path";
import Plugin from "../src/ReloadServerPlugin";

describe("ReloadServerPlugin", function() {
  beforeEach(function() {
    this.fork = expect.spyOn(cluster, "fork");
    this.on = expect.spyOn(cluster, "on").andCallThrough();
    this.setupMaster = expect.spyOn(cluster, "setupMaster");

    this.plugin = new Plugin();
  });

  afterEach(function() {
    this.fork.restore();
    this.on.restore();
    this.setupMaster.restore();

    cluster.removeAllListeners();
  });

  describe(".constructor", function() {
    it("should not have .done set", function() {
      expect(this.plugin.done).toEqual(null);
    });

    it("should not have any .workers", function() {
      expect(this.plugin.workers).toEqual([]);
    });

    it("should setupMaster", function() {
      expect(this.setupMaster).toHaveBeenCalled();
    });

    it("should default to server.js", function() {
      expect(this.setupMaster.calls[0].arguments).toEqual([
        { exec: path.join(process.cwd(), "server.js") },
      ]);
    });

    it("should listen to the cluster", function() {
      expect(this.on).toHaveBeenCalled();
    });

    it("should listen to online events", function() {
      expect(this.on.calls[0].arguments[0]).toEqual("online");
    });
  });

  describe(".apply", function() {
    beforeEach(function() {
      this.compiler = {
        plugin: expect.createSpy(),
      };

      this.plugin.apply(this.compiler);
    });

    it("should add an after-emit hook", function() {
      expect(this.compiler.plugin).toHaveBeenCalled();
      expect(this.compiler.plugin.calls[0].arguments[0]).toEqual("after-emit");
    });
  });

  context("when after-emit is fired", function() {
    beforeEach(function() {
      this.callback = expect.createSpy();
      this.compiler = {
        plugin: (event, callback) => {
          expect(event).toEqual("after-emit");

          callback({}, this.callback);
        },
      };

      this.kill = expect.spyOn(process, "kill");

      this.plugin.workers = [
        {
          process: {
            pid: "PID"
          }
        }
      ];

      this.plugin.apply(this.compiler);
    });

    afterEach(function() {
      this.callback.restore();
      this.kill.restore();
    });

    it("should set .done to the callback", function() {
      expect(this.plugin.done).toEqual(this.callback);
    });

    it("should kill each worker", function() {
      expect(this.kill).toHaveBeenCalled();
      expect(this.kill.calls.length).toEqual(1);
      expect(this.kill).toHaveBeenCalledWith("PID", "SIGTERM");
    });

    it("should clear out the worker queue", function() {
      expect(this.plugin.workers).toEqual([]);
    });

    it("should fork a new worker", function() {
      expect(this.fork).toHaveBeenCalled();
    });
  });

  context("when worker is online", function() {
    beforeEach(function() {
      this.plugin.done = expect.createSpy();
      this.worker = { id: 1 };

      cluster.emit("online", this.worker);
    });

    afterEach(function() {
      this.plugin.done.restore();
    });

    it("should add online workers to the queue", function() {
      expect(this.plugin.workers).toEqual([this.worker]);
    });

    it("should call .done", function() {
      expect(this.plugin.done).toHaveBeenCalled();
    });
  });
});
