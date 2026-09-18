import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing } from '../../styles';

const BULLET_RE = /^[-*•]\s+/;
const NUMBERED_RE = /^(\d+)\.\s+(.+)$/;
const METHOD_RE = /^Method \d+:/;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

type Block =
  | { type: 'intro'; text: string }
  | { type: 'section'; title: string; paragraphs: string[]; bullets: string[] }
  | { type: 'numbered'; number: string; title: string; paragraphs: string[]; bullets: string[] }
  | { type: 'method'; title: string; paragraphs: string[]; bullets: string[] }
  | { type: 'list'; bullets: string[] }
  | { type: 'paragraph'; text: string };

function parseBlocks(content: string): Block[] {
  const rawBlocks = content.split(/\n{2,}/).filter(Boolean);
  let introUsed = false;

  return rawBlocks
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length === 0) return null;

      if (!introUsed && lines.length === 1 && lines[0].length < 140 && lines[0].endsWith('.')) {
        introUsed = true;
        return { type: 'intro' as const, text: lines[0] };
      }

      if (METHOD_RE.test(lines[0])) {
        const rest = lines.slice(1);
        return {
          type: 'method' as const,
          title: lines[0],
          paragraphs: rest.filter((line) => !BULLET_RE.test(line)),
          bullets: rest.filter((line) => BULLET_RE.test(line)).map((line) => line.replace(BULLET_RE, '')),
        };
      }

      const numbered = lines[0].match(NUMBERED_RE);
      if (numbered) {
        const rest = lines.slice(1);
        return {
          type: 'numbered' as const,
          number: numbered[1],
          title: numbered[2],
          paragraphs: rest.filter((line) => !BULLET_RE.test(line)),
          bullets: rest.filter((line) => BULLET_RE.test(line)).map((line) => line.replace(BULLET_RE, '')),
        };
      }

      if (lines.every((line) => BULLET_RE.test(line))) {
        return {
          type: 'list' as const,
          bullets: lines.map((line) => line.replace(BULLET_RE, '')),
        };
      }

      const first = lines[0];
      const isHeading =
        lines.length > 1 && first.length < 90 && !first.endsWith('.') && !BULLET_RE.test(first);

      if (isHeading) {
        const rest = lines.slice(1);
        return {
          type: 'section' as const,
          title: first,
          paragraphs: rest.filter((line) => !BULLET_RE.test(line)),
          bullets: rest.filter((line) => BULLET_RE.test(line)).map((line) => line.replace(BULLET_RE, '')),
        };
      }

      return { type: 'paragraph' as const, text: block };
    })
    .filter(Boolean) as Block[];
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <Text style={styles.para}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={index} style={styles.strong}>
              {part.slice(2, -2)}
            </Text>
          );
        }

        const emailMatches = [...part.matchAll(EMAIL_RE)];
        if (emailMatches.length === 0) return part;

        const nodes: React.ReactNode[] = [];
        let cursor = 0;
        emailMatches.forEach((match, matchIndex) => {
          const email = match[0];
          const start = match.index ?? 0;
          if (start > cursor) nodes.push(part.slice(cursor, start));
          nodes.push(
            <Text
              key={`${email}-${matchIndex}`}
              style={styles.link}
              onPress={() => Linking.openURL(`mailto:${email}`)}
            >
              {email}
            </Text>,
          );
          cursor = start + email.length;
        });
        if (cursor < part.length) nodes.push(part.slice(cursor));
        return <Text key={index}>{nodes}</Text>;
      })}
    </Text>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.listRow}>
          <Text style={styles.bullet}>•</Text>
          <View style={styles.listText}>
            <InlineText text={item} />
          </View>
        </View>
      ))}
    </View>
  );
}

function SectionBlock({
  title,
  paragraphs,
  bullets,
  numbered,
  divider,
}: {
  title: string;
  paragraphs: string[];
  bullets: string[];
  numbered?: string;
  divider?: boolean;
}) {
  return (
    <View style={[styles.section, divider ? styles.sectionDivider : null]}>
      <Text style={styles.heading}>
        {numbered ? `${numbered}. ` : ''}
        {title}
      </Text>
      {paragraphs.map((paragraph) => (
        <InlineText key={paragraph} text={paragraph} />
      ))}
      <BulletList items={bullets} />
    </View>
  );
}

type Props = {
  content: string;
};

export default function LegalDocumentBody({ content }: Props) {
  const blocks = parseBlocks(content);
  let sectionIndex = 0;

  return (
    <View style={styles.wrap}>
      {blocks.map((block) => {
        if (block.type === 'intro') {
          return <InlineText key={block.text} text={block.text} />;
        }

        if (block.type === 'method') {
          sectionIndex += 1;
          return (
            <View key={block.title} style={styles.methodCard}>
              <Text style={styles.methodTitle}>{block.title}</Text>
              {block.paragraphs.map((paragraph) => (
                <InlineText key={paragraph} text={paragraph} />
              ))}
              <BulletList items={block.bullets} />
            </View>
          );
        }

        if (block.type === 'numbered' || block.type === 'section') {
          sectionIndex += 1;
          const divider = sectionIndex > 1;
          return (
            <SectionBlock
              key={`${block.type}-${'number' in block ? block.number : block.title}`}
              title={block.title}
              paragraphs={block.paragraphs}
              bullets={block.bullets}
              numbered={'number' in block ? block.number : undefined}
              divider={divider}
            />
          );
        }

        if (block.type === 'list') {
          return <BulletList key={block.bullets.join('|')} items={block.bullets} />;
        }

        return <InlineText key={block.text.slice(0, 40)} text={block.text} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  sectionDivider: {
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  para: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  strong: {
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  list: {
    gap: 8,
    paddingLeft: 4,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  listText: {
    flex: 1,
  },
  methodCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.backgroundAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  methodTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text,
  },
});
