const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const grpcServer = require('./grpcServer');
dotenv.config();

const app=express();
