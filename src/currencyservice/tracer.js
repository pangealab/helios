'use strict';

const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { CollectorTraceExporter } =  require('@opentelemetry/exporter-collector');
const { B3Propagator  } = require('@opentelemetry/propagator-b3');

opentelemetry.propagation.setGlobalPropagator(new B3Propagator ())

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider();

  const exporter = new CollectorTraceExporter({
    serviceName: serviceName,
    url: `https://${process.env.LIGHTSTEP_HOST}/traces/otlp/v0.6`,
    headers: {
      'Lightstep-Access-Token': process.env.LS_ACCESS_TOKEN
    },
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('currencyservice');
};