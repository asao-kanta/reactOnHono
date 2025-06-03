import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as path from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC作成
    const vpc = new ec2.Vpc(this, 'AppVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Entra ID認証情報用のSecret作成（手動で値を設定）
    const entraIdSecret = new secretsmanager.Secret(this, 'EntraIdSecret', {
      secretName: 'todo-app-entra-id-credentials',
      description: 'Entra ID authentication credentials for Todo App',
      // シークレット値は手動でAWS Consoleから設定
    });

    // RDS MySQL (無料枠対象 - コスト重視)
    const dbInstance = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_35
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), // 無料枠対象
      vpc,
      credentials: rds.Credentials.fromGeneratedSecret('dbadmin', {
        secretName: 'todo-app-db-credentials'
      }),
      databaseName: 'todo',
      allocatedStorage: 20, // 無料枠: 20GB
      storageType: rds.StorageType.GP2, // 無料枠対象
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      backupRetention: cdk.Duration.days(7), // 最小バックアップ期間
      deleteAutomatedBackups: true, // コスト削減
      deletionProtection: false, // 開発用途のため無効
    });

    // Lambda関数用のセキュリティグループ
    const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc,
      description: 'Security group for Lambda function',
      allowAllOutbound: true,
    });

    // RDSへのアクセスを許可
    dbInstance.connections.allowDefaultPortFrom(lambdaSecurityGroup);

    // Lambda関数（Dockerベース）
    const todoFunction = new lambda.Function(this, 'TodoFunction', {
      runtime: lambda.Runtime.FROM_IMAGE,
      handler: lambda.Handler.FROM_IMAGE,
      code: lambda.Code.fromAssetImage(path.join(__dirname, '../../apps'), {
        file: 'lambda.Dockerfile',
      }),
      environment: {
        DATABASE_URL: `mysql://dbadmin:${dbInstance.secret?.secretValueFromJson('password').unsafeUnwrap()}@${dbInstance.instanceEndpoint.hostname}:3306/todo`,
        API_AUTH_TYPE: 'session',
        FRONTEND_AUTH_TYPE: 'none',
        // Entra ID Secret ARN
        ENTRA_SECRET_ARN: entraIdSecret.secretArn,
        NODE_ENV: 'production',
      },
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [lambdaSecurityGroup],
      timeout: cdk.Duration.minutes(5),
      memorySize: 1024,
      architecture: lambda.Architecture.X86_64,
    });

    // Lambda関数にRDSシークレットへのアクセス権限を付与
    dbInstance.secret?.grantRead(todoFunction);
    
    // Lambda関数にEntra IDシークレットへのアクセス権限を付与
    entraIdSecret.grantRead(todoFunction);

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, 'TodoApi', {
      handler: todoFunction,
      proxy: true,
      binaryMediaTypes: ['*/*'],
      deployOptions: {
        stageName: 'prod',
      },
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.AnyPrincipal()],
            actions: ['execute-api:Invoke'],
            resources: ['*'],
            conditions: {
              IpAddress: {
                'aws:SourceIp': [
                  '203.114.27.230/32'
                ]
              }
            }
          })
        ]
      })
    });

    // 出力
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: dbInstance.instanceEndpoint.hostname,
      description: 'RDS Instance Endpoint',
    });
  }
}
