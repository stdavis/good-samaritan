#!/usr/bin/env node
import main from 'good-samaritan';
import handle from '@oclif/errors/handle.js';

main.run().catch(handle);
