import * as fs from 'fs-extra';

enum PropName {
    lines = 'lines',
    statements = 'statements',
    functions = 'functions',
    branches = 'branches',
}

enum Color {
    green = 'green',
    orange = 'orange',
    red = 'red',
}

interface Props {
    total: number;
    covered: number;
    pct: number;
}

interface Shield {
    schemaVersion: 1;
    label: `coverage: ${PropName}`;
    message: string;
    color: Color;
}

console.log('Hello World!');

const coverageSummary = fs.readJsonSync('coverage/libs/ngx-feature-flag-router/coverage-summary.json');

const getProps = (propName: PropName): Props => {
    const props = coverageSummary['total'][propName];

    return {
         total: +props.total,
         covered: +props.covered,
         pct: +props.pct,
    };
}

const getMessage = (props: Props): string => {
    const { pct, covered, total } = props;

    return `${pct}% (${covered}/${total})`;
}

const getColor = (props: Props): Color => {
    const { pct } = props;

    if (pct <= 65) {
        return Color.red;
    }

    if (pct <= 75) {
        return Color.orange;
    }

    return Color.green;
}

const getShield = (propName: PropName): Shield => {
    const props = getProps(propName);
    const message = getMessage(props);
    const color = getColor(props);

    return {
        schemaVersion: 1,
        label: `coverage: ${propName}`,
        message,
        color,
    };
}

const writeShieldJson = (propName: PropName): void => {
    const shield = getShield(propName);

    fs.writeJSONSync(`jest-badge/${propName}.json`, shield, {
        spaces: 4,
    });
}

const propNames: PropName[] = [PropName.lines, PropName.statements, PropName.functions, PropName.branches];

propNames.forEach(propName => {
    writeShieldJson(propName);
});
