# Prerequisites

## Install StrongLoop

http://docs.strongloop.com/display/LB/Installing+StrongLoop

## Minimum versions

Before starting the tutorial or trying out the demos, make sure you have the
following StrongLoop libraries installed:

```
strongloop v4.0.4 (node v0.10.36)
├── strong-arc@1.4.2 (f74d03c)
├── strong-build@2.0.2 (3221b91)
├── strong-deploy@2.2.2 (13baab4)
├── strong-pm@4.2.1 (72a249c)
├── strong-registry@1.1.5 (f46e58f)
├── strong-start@1.2.0 (e59f8b5)
├─┬ strong-supervisor@2.0.0 (4c3ac51)
│ └── strong-agent@1.6.0
├── generator-loopback@1.9.1 (5219ef1)
├── node-inspector@0.7.4
└── nodefly-register@0.3.3
```

> Check your library versions by running `slc -v` or update them by running `slc
update`.

## Obtain a StrongLoop license

To get a free 30-day trial license for this beta demo, run [StrongLoop Arc](https://strongloop.com/node-js/arc/)
as follows:

```
slc arc --licenses
```

Then login to Arc (if you have not already done so) and you'll see the
`Licenses` page showing your trial licenses.

### Add the current directory to the PATH environment variable

You will need to add the current directory to the [PATH environment variable](http://en.wikipedia.org/wiki/PATH_(variable))
to run the included `build-server` scripts. Do this by adding the following to
your startup script:

```
PATH=$PATH:.
```
